import React, { FC, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from '../firebase';
import withAuthRedirect from '@/withAuthRedirect';

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	onLogout: () => void;
	userName: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout, userName }) => {
	return (
		<div
			className={`sidebar bg-blue-900 text-white fixed top-0 bottom-0 transition-transform duration-300 ${
				isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
			}`}
		>
			<div className="user-info p-4 bg-blue-800">
				<button
					onClick={onLogout}
					className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold"
				>
					Logout
				</button>
			</div>
			
		</div>
	);
};

const Profile: FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const auth = getAuth(app);
	const [user] = useAuthState(auth);

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				// Handle successful logout
			})
			.catch((error) => {
				// Handle error
			});
	};

	return (
		<div className="profile-page flex">
			<div className="hidden md:block">
				<Sidebar
					isOpen={true}
					onClose={() => setSidebarOpen(false)}
					onLogout={handleLogout}
					userName={user ? user.displayName : ''}
				/>
			</div>
			<div className="md:hidden">
				<button
					onClick={() => setSidebarOpen(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
				>
					Open Sidebar
				</button>
				<Sidebar
					isOpen={sidebarOpen}
					onClose={() => setSidebarOpen(false)}
					onLogout={handleLogout}
					userName={user ? user.displayName : ''}
				/>
			</div>
			<div className="content flex-grow p-6">
				{/* Add your content here */}
			</div>
		</div>
	);
};

const WrappedProfile = withAuthRedirect(Profile);

export default WrappedProfile;
