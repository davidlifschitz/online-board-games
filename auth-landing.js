const SUPABASE_URL='https://slnvfdkyvijrhmisurhw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_zUTHu9mHMbPfNKIgM_O0Zg_INCN9yF6';

async function handleBuilderAuthReturn(){
  const shouldReturn=sessionStorage.getItem('builderBoardReturnToSubmit')==='1';
  const searchParams=new URLSearchParams(window.location.search);
  const hashParams=new URLSearchParams(window.location.hash.replace(/^#/,'') );
  const authError=searchParams.get('error_description')||searchParams.get('error')||hashParams.get('error_description')||hashParams.get('error');
  if(authError&&shouldReturn){
    sessionStorage.removeItem('builderBoardReturnToSubmit');
    sessionStorage.setItem('builderBoardAuthError',authError);
    window.location.replace('/build.html#submit');
    return;
  }
  if(!shouldReturn||!window.supabase?.createClient)return;

  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
  });
  const {data,error}=await client.auth.getSession();
  if(error){
    sessionStorage.removeItem('builderBoardReturnToSubmit');
    sessionStorage.setItem('builderBoardAuthError',error.message);
    window.location.replace('/build.html#submit');
    return;
  }
  if(data?.session){
    sessionStorage.removeItem('builderBoardReturnToSubmit');
    window.location.replace('/build.html#submit');
  }
}

handleBuilderAuthReturn().catch(error=>{
  console.error('Auth return handling failed',error);
  if(sessionStorage.getItem('builderBoardReturnToSubmit')==='1'){
    sessionStorage.removeItem('builderBoardReturnToSubmit');
    sessionStorage.setItem('builderBoardAuthError','Sign-in completed, but the return flow could not be restored. Try again.');
    window.location.replace('/build.html#submit');
  }
});
