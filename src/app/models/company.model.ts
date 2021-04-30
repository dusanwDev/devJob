export interface Company {
  companyId: string;
  companyName: string;
  aboutUs: string;
  whatWeDo: string;
  comments: [{ positive: string; negative: string }];
  interviews: [{ hrInterview: string; technicalInterview: string }];
  languages: string[];
  jobs: [
    {
      city: string;
      companyId: string;
      companyName: string;
      companyPicture: string;
      country: string;
      employment: string;
      jobDescription: string;
      position: string;
      salary: number;
      seniority: string;
      shortDescription: string;
      technology: string[];
      yearsOfExpirience: number;
      date: Date;
    }
  ];
  image: string;
  city: string;
  numberOfEmployees: number;
  salaryRangeFrom: number;
  salaryRangeTo: number;
  appliedDevelopers: [];
}
