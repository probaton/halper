interface HalpAction {
  command: string;
  helpText?: string;
  function: (...args: any[]) => any;
  spinnerText?: string;
  args?: HalpArg[];
}

interface HalpArg {
  flag: HalpArgFlag;
  helpText?: string;
  default?: any;
  requiredMessage?: string;
}

type HalpArgFlag = number | string | string[];
