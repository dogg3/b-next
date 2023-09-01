// utils/withAuthRedirect.tsx

import React, { FC, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { app } from './firebase';


interface WithAuthRedirectProps {
	// Add any additional props your wrapped component might receive
}

const withAuthRedirect = <P extends WithAuthRedirectProps>(
	WrappedComponent: FC<P>
) => {
	const WithAuthRedirectWrapper: FC<P> = (props) => {
		const auth = getAuth(app);
		const router = useRouter();

		const handleAuthStateChange = (user: User | null) => {
			if (!user) {
				router.replace('/');
			}
		};

		useEffect(() => {
			// Subscribe to authentication state changes
			const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

			return () => unsubscribe();
		}, []);

		return <WrappedComponent {...props} />;
	};

	return WithAuthRedirectWrapper;
};

export default withAuthRedirect;
