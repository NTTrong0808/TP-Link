import { caslIsAbleTo, useAbilityInstance } from './casl';
import { CASL_ACCESS_KEY } from './casl-key';

const useExampleAuthHook = () => {
  const caslAbility = useAbilityInstance();

  const isHavePermissionAccessAndPerformInspectation = caslIsAbleTo(
    caslAbility,
    CASL_ACCESS_KEY.TICKET_ACCESS_AND_PERFORM_INSPECTATION
  );

  return {
    isHavePermissionAccessAndPerformInspectation,
  };
};

export default useExampleAuthHook;
