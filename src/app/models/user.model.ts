export class User {
  constructor(
    private userId: string,
    private _token: string,
    private expdate: Date,
    private refreshToken: string,
    private registered?: string
  ) {}
  get token() {
    if (!this.expdate || new Date() > this.expdate) {
      return null;
    }

    console.log('RETURNIG TOKEN FROM USER MDOEL');
    return this._token;
  }
  get _userId() {
    return this.userId;
  }
}
// export class Company extends User {
//   constructor(
//     private companyId: string,
//     private _tokenCompany: string,
//     private expdateCompany: Date,
//     private refreshTokenCompany: string,
//     private registeredCompany?: string
//   ) {
//     super(
//       companyId,
//       _tokenCompany,
//       expdateCompany,
//       refreshTokenCompany,
//       registeredCompany
//     );
//   }
// }
// export class Developer extends User {
//   constructor(
//     private DeveloperId: string,
//     private _tokenDeveloper: string,
//     private expdateDeveloper: Date,
//     private refreshTokenDeveloper: string,
//     private registeredDeveloper?: string
//   ) {
//     super(
//       DeveloperId,
//       _tokenDeveloper,
//       expdateDeveloper,
//       refreshTokenDeveloper,
//       registeredDeveloper
//     );
//   }
//   get devId() {
//     return this.DeveloperId;
//   }
// }
