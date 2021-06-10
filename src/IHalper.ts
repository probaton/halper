interface IHalper {
  command: string;
  helpText?: string;
  function: (...args: any[]) => any;
  spinnerText?: string;
  args?: IHalpArg[];
}

interface IHalpArg {
  flag: IHalpArgFlag;
  helpText?: string;
  default?: any;
  requiredMessage?: string;
}

type IHalpArgFlag = number | string | string[];
