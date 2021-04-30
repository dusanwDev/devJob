import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Company } from 'src/app/models/company.model';
import { Utility } from 'src/app/models/utility.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  constructor(private afs: AngularFirestore) {}
  companies: Company[] = [];
  companiesForm: FormGroup;
  city: string[] = [];
  input = '';
  numberOfEmployees: number[] = [];
  ngOnInit(): void {
    this.loadData();
    this.companiesForm = new FormGroup({
      city: new FormControl(null),
      employees: new FormControl(null),
      raiting: new FormControl(null),
      companyName: new FormControl(null),
      salary: new FormControl(null),
    });
    this.afs
      .collection<Company>(Utility.dataBase, (ref) =>
        ref.where('companyId', '!=', 'null')
      )
      .valueChanges()
      .subscribe((companies) => {
        this.companies = companies;
      });
  }
  filtered = [];
  showMessage = false;
  search() {
    this.filtered = [];

    this.filtered = this.companies.filter((company) => {
      if (
        company.city === this.companiesForm.get('city').value ||
        company.companyName === this.companiesForm.get('companyName').value ||
        company.numberOfEmployees <=
          +this.companiesForm.get('employees').value ||
        company.salaryRangeTo <= +this.companiesForm.get('salary').value
      ) {
        this.showMessage = false;
        return company;
      } else {
        this.showMessage = true;
      }
    });
  }
  loadData() {
    this.afs
      .collection<Company>(Utility.dataBase, (ref) =>
        ref.where('companyId', '!=', 'null')
      )
      .valueChanges()
      .subscribe((companies) => {
        companies.filter((company, index) => {
          this.city.push(company.city);
          this.city = this.city.filter(
            (v, i, a) => a.findIndex((t) => t === v) === i
          );
          if (typeof this.city[index] === 'undefined') {
            this.city.splice(index, 1);
          }
          this.numberOfEmployees.push(company.numberOfEmployees);
          this.numberOfEmployees = this.numberOfEmployees.filter(
            (v, i, a) => a.findIndex((t) => t === v) === i
          );
        });
      });
  }
}
