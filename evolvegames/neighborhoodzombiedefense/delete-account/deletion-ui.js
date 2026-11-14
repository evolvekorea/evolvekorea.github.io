const words={ko:{missing:'이 Google 계정으로 등록된 기존 게임 계정이 없습니다. 게임에 사용한 다른 계정을 선택하거나 이메일로 문의해 주세요.',title:'Google 로그인으로 삭제 요청',lead:'게임에서 사용한 Google 계정으로 로그인한 뒤 삭제할 계정을 확인해 주세요.',login:'Google로 본인 확인',switch:'다른 계정 선택',check:'이 게임 계정과 클라우드 진행을 영구 삭제하며, 복구할 수 없음을 확인했습니다. Google 계정 자체는 삭제되지 않습니다.',remove:'게임 계정 및 클라우드 영구 삭제 요청',busy:'처리 중입니다…',ready:'계정이 맞는지 확인한 뒤 삭제 확인란을 선택해 주세요.',accepted:'삭제 요청을 접수했습니다. 이 페이지를 닫아도 서버에서 처리합니다. 보통 곧 완료되며, 7일 내 처리되지 않으면 이메일로 문의해 주세요.',done:'게임 계정과 클라우드 저장 삭제가 완료되었습니다. Google 계정은 유지됩니다. 휴대폰의 로컬 데이터는 아래 안내에 따라 별도로 삭제해 주세요.',cancel:'로그인을 취소했습니다. 삭제하지 않았습니다.',fresh:'본인 확인 시간이 지났습니다. 다시 로그인한 뒤 삭제할 계정을 확인해 주세요.',failed:'접수 여부를 확인하지 못했습니다. 인터넷 연결을 확인해 주세요. 재로그인이 되지 않거나 계속 실패하면 아래 이메일로 문의해 주세요.',loginFailed:'로그인하지 못했습니다. 팝업 허용과 연결을 확인하거나 이메일로 삭제를 요청해 주세요.'},en:{missing:'No existing game account was found for this Google account. Choose the account used in the game, or contact us by email.',title:'Request deletion with Google',lead:'Sign in with the Google account used in the game, then check the account below.',login:'Verify with Google',switch:'Choose another account',check:'I understand that my game account and cloud progress will be permanently deleted and cannot be recovered. My Google account will remain.',remove:'Request permanent game account deletion',busy:'Processing…',ready:'Check this account, then select the confirmation checkbox.',accepted:'Your request was accepted. Processing continues on the server even if you close this page. It usually finishes shortly; contact us by email if it is not completed within 7 days.',done:'Your game account and cloud save have been deleted. Your Google account remains. Follow the instructions below to remove local device data separately.',cancel:'Sign-in cancelled. Nothing was deleted.',fresh:'Identity verification expired. Sign in again and check the account before deleting.',failed:'We could not confirm whether the request was accepted. Check your connection. If you cannot sign in again or this continues, contact the email below.',loginFailed:'Sign-in failed. Check pop-up permissions and your connection, or request deletion by email.'}};
export function mountDeletionUI(io,lang='ko'){
 const el=id=>document.getElementById(id);let identity=null,busy=false,submitted=false,stop=null,statusKey=null;
 const text=()=>words[lang];
 const status=key=>{statusKey=key;el('status').textContent=text()[key];el('status').hidden=false;};
 const render=()=>{
  for(const [id,key] of [['online-title','title'],['online-lead','lead'],['sign-in','login'],['sign-out','switch'],['confirm-label','check'],['delete-account','remove']])el(id).textContent=text()[key];
  el('sign-in').hidden=!!identity||submitted;el('sign-in').disabled=busy;
  el('sign-out').hidden=!identity||submitted;el('sign-out').disabled=busy;
  el('confirmation').hidden=!identity||submitted;el('delete-account').disabled=busy||!el('confirm').checked;
  el('account').textContent=identity?.email||'';if(statusKey)status(statusKey);
 };
 el('online-deletion').hidden=false;el('online-english-link').hidden=false;
 el('use-english').onclick=()=>{lang='en';render()};
 el('confirm').onchange=render;
 el('sign-in').onclick=async()=>{busy=true;render();try{identity=await io.signIn();el('confirm').checked=false;status('ready')}catch(e){status(e.code==='auth/popup-closed-by-user'?'cancel':e.code==='auth/no-existing-game-account'?'missing':'loginFailed')}finally{busy=false;render()}};
 el('sign-out').onclick=async()=>{stop?.();await io.signOut();identity=null;el('confirm').checked=false;el('status').hidden=true;statusKey=null;render()};
 el('delete-account').onclick=async()=>{
  if(busy||submitted||!identity||!el('confirm').checked)return;
  busy=true;status('busy');render();
  try{
   const response=await io.request(identity.uid);
   if(response?.accepted!==true)throw new Error('Not acknowledged');
   submitted=true;status('accepted');render();
   stop=io.watch(identity.uid,job=>{if(job?.state==='completed'){status('done');stop?.();io.signOut().catch(()=>{});identity=null;render()}},()=>{status('accepted')});
  }catch(e){if(e.code==='functions/failed-precondition'){await io.signOut();identity=null;status('fresh')}else status('failed');el('confirm').checked=false}
  finally{busy=false;render()}
 };
 render();return ()=>{stop?.()};
}
