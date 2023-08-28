import { allowAccess } from '@/services/hmdp/security'

export function AccessChecker(props: any) {
    
  let accessAllow = true;

  if(props.checker) {
    accessAllow = accessAllow && props.checker();
    console.log(`accessAllow ${accessAllow}`);
  }

  if(props.featureCode) {
    accessAllow = accessAllow && allowAccess(props.featureCode);
  }

  return (
    <>
      {
         accessAllow ? props.children : ''
      }
    </>
  );
}