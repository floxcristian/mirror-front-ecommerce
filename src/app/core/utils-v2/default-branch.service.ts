import { environment } from '@env/environment';

export class DefaultBranch {
  static getBranchCode(branchCode?: string): string {
    console.log(
      'getBranchCode',
      branchCode,
      environment.defaultBranch.code,
      branchCode ? branchCode : environment.defaultBranch.code
    );
    return branchCode ? branchCode : environment.defaultBranch.code;
  }
}
