import React, { FC } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from '../firebase';
import withAuthRedirect from '@/withAuthRedirect';
import ServiceTypeManagement from '@/components/profile/ServiceTypeManagement';

const Profile: FC = () => {
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
		<div className="flex">
			<div className="flex-grow p-6">
				<div className="text-right">
					<button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold text-white"
					>
						Logout
					</button>
				</div>
				<ServiceTypeManagement user={user} />
			</div>
		</div>
	);
};

const WrappedProfile = withAuthRedirect(Profile);

export default WrappedProfile;
