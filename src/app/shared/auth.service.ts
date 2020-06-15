import { Injectable,NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { User } from "./user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { Plugins } from '@capacitor/core';
//Plugins.GoogleAuth.signIn();
const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  platformDetect:any;

  constructor(public router: Router,
    public ngZone: NgZone,
    public afAuth: AngularFireAuth,
    private angularFireAuth: AngularFireAuth) { 
      this.afAuth.authState.subscribe(user => {
        this.user = user;
    })

    this.detectOS();
   
    }

   

    async detectOS(){
      const info = await Device.getInfo();
      this.platformDetect = info.platform;
      alert(this.platformDetect);
      console.log(this.platformDetect);
      }


    // Firebase SignInWithPopup
   OAuthProvider(provider) {
    return this.afAuth.signInWithPopup(provider)
        .then((res) => {
            this.ngZone.run(() => {
                this.router.navigate(['dashboard']);
            })
        }).catch((error) => {
            window.alert(error)
        })
}

// Firebase Google Sign-in
SigninWithGoogle() {

      if (this.platformDetect == 'web') {
        return this.OAuthProvider(new auth.GoogleAuthProvider())
        .then(res => {
            console.log('Successfully logged in!')
        }).catch(error => {
            console.log(error)
        });
      } else {
        this.googleSignIn(); 
        /*let googleUser = Plugins.GoogleAuth.signIn();
        const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        return this.afAuth.signInWithCredential(credential)
        .then(res => {
         
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
        })
  
        }).catch(error => {
          alert(error);
        });
      }*/
        

    
}
}


async googleSignIn() {
  let googleUser = await Plugins.GoogleAuth.signIn();
  const credential = auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
  console.log(credential);
  return this.afAuth.signInWithCredential(credential)
  .then(res => {
         
    this.ngZone.run(() => {
      this.router.navigate(['dashboard']);
  })

}).catch(error => {
  alert(error);
});
}


// Firebase Logout 
SignOut() {
  if(this.platformDetect == 'web'){
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['login']);
    })
  }else{
    return Plugins.GoogleAuth.signOut().then(() => {
      this.router.navigate(['login']);
    })
  }
   
  }


}
