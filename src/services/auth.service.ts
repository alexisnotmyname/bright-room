import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';

@Injectable()
export class AuthService {
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth, 
				public gplus: GooglePlus,
				private platform: Platform ) 
	{
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
    }

  	async signInWithGoogle(): Promise<void> {
		console.log('Sign in with google');
		if(!(<any>window).cordova){
			return await this.webGoogleLogin();
		} else {
			return await this.nativeGoogleLogin();
		}
	}

	async nativeGoogleLogin(): Promise<void>{
		try{
				const gplusUser = await this.gplus.login({
				'webClientId': '870004644864-qntp6hj38seui6l7l22feglb41v6kfpj.apps.googleusercontent.com',
				'offline': true,
				'scopes': 'profile email'
		  	})
				return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
		}catch(err){
		  console.log(err)
		}
	}

	async webGoogleLogin(): Promise<void> {
		try {
		  const provider = new firebase.auth.GoogleAuthProvider();
		  const credential = await this.afAuth.auth.signInWithPopup(provider);
			
		} catch(err) {
		  console.log(err)
		}
	  
	}

	getUser() {
		return this.user;
	}

	signOut(): Promise<void> {
		this.gplus.logout();
		return firebase.auth().signOut();
		// return this.afAuth.auth.signOut();
	}

	// async oauthSignIn(provider: AuthProvider): Promise<void> {
	// 	try{

	// 		if (!(<any>window).cordova) {
	// 			return this.afAuth.auth.signInWithPopup(provider);
	// 		} else {
	// 			const gplusUser = await this.gplus.login({
	// 				'webClientId': '870004644864-qntp6hj38seui6l7l22feglb41v6kfpj.apps.googleusercontent.com',
	// 				'offline': true,
	// 				'scopes': 'profile email'
	// 				})
	// 				return this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
	// 		}

	// 	}catch(error){
	// 		console.log(error)
	// 	}
	// }

	// private oauthSignIn(provider: AuthProvider) {
	// 	if (!(<any>window).cordova) {
	// 		return this.afAuth.auth.signInWithPopup(provider);
	// 	} else {
	// 		return this.afAuth.auth.signInWithRedirect(provider)
	// 		.then(() => {
	// 			return this.afAuth.auth.getRedirectResult().then( result => {
	// 				// This gives you a Google Access Token.
	// 				// You can use it to access the Google API.
	// 				let token = result.credential.accessToken;
	// 				// The signed-in user info.
	// 				let user = result.user;
	// 				console.log(token, user);
	// 			}).catch(function(error) {
	// 				// Handle Errors here.
	// 				alert(error.message);
	// 			});
	// 		});
	// 	}
	// }
    

}