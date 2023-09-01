import React, {useState, FC, useEffect} from 'react';
import {getAuth, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {app} from '../firebase';
import {useRouter} from 'next/router';

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLogin: () => void;
}

export const LoginModal: FC<LoginModalProps> = ({isOpen, onClose, onLogin}) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('modal-overlay')) {
			onClose();
		}
	};

	const handleSignIn = async () => {
		const auth = getAuth(app);
		try {
			setIsLoading(true);
			await signInWithEmailAndPassword(auth, email, password);
			console.log('User signed in successfully');
			onClose();
			onLogin();
		} catch (error: any) {
			console.error('Sign-in error:', error);
			if (error.code === 'auth/wrong-password') {
				setError('Fel lösenord eller email');
			} else {
				setError('Pröva igen');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return isOpen ? (
		<div
			className="modal-overlay fixed inset-0 flex justify-center items-center bg-black bg-opacity-40"
			onClick={handleModalClick}
		>
			<div className="modal bg-white p-8 rounded shadow-md relative">
        <span className="close absolute top-2 right-2 text-gray-500 cursor-pointer" onClick={onClose}>
          &times;
        </span>
				<h2 className="mb-4 text-xl font-bold">Logga in</h2>
				<label className="block mb-2">
					E-post:
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border rounded p-2"
					/>
				</label>
				<label className="block mb-4">
					Lösenord:
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border rounded p-2"
					/>
				</label>
				{error && <p className="text-red-500">{error}</p>}
				<button onClick={handleSignIn}
						className={`w-full bg-blue-500 text-white py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
						disabled={isLoading}>
					{isLoading ? 'Loggar in...' : 'Logga in'}
				</button>
			</div>
		</div>
	) : null;
};


const Index: FC = () => {
	const router = useRouter();
	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push('/profile'); // Redirect to the profile page if user is logged in
			}
		});
		return () => unsubscribe();
	}, []);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleModalOpen = () => {
		setIsModalOpen(true);
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
	};

	const handleLogin = () => {
		// Perform any post-login logic here
		// You can update your app state or navigate to a different page
		console.log('Logged in successfully');
	};

	return (
		<main className="flex justify-center items-center h-screen">
			<button onClick={handleModalOpen} className="px-4 py-2 bg-blue-500 text-white rounded">
				Logga in
			</button>
			<LoginModal isOpen={isModalOpen} onClose={handleModalClose} onLogin={handleLogin}/>
		</main>
	);
};

export default Index;
