import {mountDeletionUI} from './deletion-ui.js';
// Activation happens only after the server, rules and Google sign-in are verified.
async function boot(){
 const response=await fetch('./service-config.json',{cache:'no-store'});
 if(!response.ok)return;
 const config=await response.json();if(config.enabled!==true)return;
 const base='https://www.gstatic.com/firebasejs/13.3.0/';
 const [appSdk,authSdk,firestoreSdk,functionsSdk]=await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js','firebase-functions.js'].map(file=>import(base+file)));
 const app=appSdk.initializeApp(config.firebase),auth=authSdk.getAuth(app),db=firestoreSdk.getFirestore(app);
 await authSdk.setPersistence(auth,authSdk.inMemoryPersistence);
 const provider=new authSdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
 const request=functionsSdk.httpsCallable(functionsSdk.getFunctions(app,'asia-northeast3'),'requestAccountDeletion',{timeout:30000});
 mountDeletionUI({
  signIn:async()=>{
   const result=await authSdk.signInWithPopup(auth,provider),user=result.user;
   if(authSdk.getAdditionalUserInfo(result)?.isNewUser){
    // OAuth can create a profile for an unrelated Google account. Remove only
    // the just-created empty Auth identity; never look up targets by email.
    await authSdk.deleteUser(user);
    throw Object.assign(new Error('No existing game account'),{code:'auth/no-existing-game-account'});
   }
   return {uid:user.uid,email:user.email};
  },
  signOut:()=>authSdk.signOut(auth),
  request:async uid=>(await request({confirm:true,accountUid:uid})).data,
  watch:(uid,next,error)=>firestoreSdk.onSnapshot(firestoreSdk.doc(db,'accountDeletions',uid),s=>next(s.data()),error)
 },location.hash==='#english'?'en':'ko');
}
boot().catch(()=>{/* Email deletion remains available when the online service is unavailable. */});
