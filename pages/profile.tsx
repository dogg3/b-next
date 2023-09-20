import React, {FC} from 'react';
import {getAuth, signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {app} from '../firebase';
import withAuthRedirect from '@/withAuthRedirect';
import ServiceTypeManagement from '@/components/profile/ServiceTypeManagement';
import {useRouter} from "next/router";

const Profile: FC = () => {
	const router = useRouter(); // Initialize useRouter

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
	const linkToRamso = `${router.basePath}/ramso`;

	return (
		<div className="flex">
			<div className="flex-grow p-6">
				<div className="text-right">

					<button
						style={{
							padding: '8px 16px', // Adjust padding as needed
							backgroundColor: '#007bff', // Button background color
							color: 'white', // Button text color
							border: 'none', // Remove button border
							borderRadius: '4px', // Add border radius for rounded corners
							cursor: 'pointer', // Show pointer cursor on hover
						}}
						onClick={() => router.push(linkToRamso)}
					>
						Gå till tjänst-prisförfrågningar
					</button>
					<button
						onClick={handleLogout}
						className="ml-[20px] bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold text-white"
					>
						Logout
					</button>
				</div>

				<ServiceTypeManagement user={user}/>
			</div>
		</div>
	);
};

const WrappedProfile = withAuthRedirect(Profile);

export default WrappedProfile;
