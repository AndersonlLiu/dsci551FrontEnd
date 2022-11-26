import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  countChecked: boolean = false;
  selectedType = '';
  returnData: any = "";




	onSelected(value:string): void {
		this.selectedType = value;
    if (this.selectedType === "crime.csv") {
      this.searchForm.controls['crimetype'].enable();
      this.searchForm.controls['categoryoforrest'].disable();
    } else if (this.selectedType === "collision.csv") {
      this.searchForm.controls['categoryoforrest'].disable();
      this.searchForm.controls['crimetype'].disable();
    } else if (this.selectedType === "arrest.csv") {
      this.searchForm.controls['crimetype'].disable();
      this.searchForm.controls['categoryoforrest'].enable();
    } else if (this.selectedType === "marijuana.csv") {
      this.searchForm.controls['categoryoforrest'].disable();
      this.searchForm.controls['crimetype'].disable();
    } else {
      this.searchForm.controls['categoryoforrest'].disable();
      this.searchForm.controls['crimetype'].disable();
    }
	}

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit()  {
    this.searchForm = this.formBuilder.group({
      type: ['', Validators.required],
      crimetype: [''],
      startdate: [''],
      enddate: [''],
      victomsex: [''],
      categoryoforrest: [''],
      location: [''],
      database: ['']
  });

  }

  CountonSelect(event: any) {
    if ( event.target.checked ) {
    this.countChecked = true;
   } else {
    this.countChecked = false;
   }
  }

  dateCheck(startdate: string, enddate: string){
    let startDate = new Date(startdate);
    let endDate = new Date(enddate);

    if (startDate > endDate) {
        alert("End date need to be bigger then start date");
    }
}

  onSubmit() {
    const type = this.searchForm.value.type;
    console.log(type);
    let oldstartdate = this.searchForm.value.startdate;
    const [syear, smonth, sday] = oldstartdate.split('-');
    let startdate = [smonth, sday, syear].join('/');
    const oldenddate = this.searchForm.value.enddate;
    const [year, month, day] = oldenddate.split('-');
    let enddate = [month, day, year].join('/');
    this.dateCheck(oldstartdate, oldenddate);
    const crimetype = this.searchForm.value.crimetype;
    const victomsex = this.searchForm.value.victomsex;
    const categoryoforrest = this.searchForm.value.categoryoforrest;
    const location = this.searchForm.value.location;
    const database = this.searchForm.value.database;
    let req: any = {};
    req.table = "/crime/" + type;
    req.database = database;
    req.argsEq = {};
    req.argsLte = {};
    req.argsGte = {};
    if (crimetype != "" && crimetype != undefined){
      req.argsEq['Crime Category'] = crimetype
    }
    if (startdate != "//") {
      req.argsGte['Date'] = startdate
    }
    if (enddate != "//") {
      req.argsLte['Date'] = enddate
    }
    if (victomsex != "") {
      req.argsEq['Gender'] = victomsex
    }
    if (categoryoforrest != "" && categoryoforrest != undefined) {
      req.argsEq['Arrest Type Code'] = categoryoforrest
    }
    if (location != "") {
      req.argsEq['Location'] = location
    }
    if (this.countChecked) {
      req.cal = "COUNT"
    }
    console.log(req);
    const body=req;
    this.http.post<any>('http://127.0.0.1:5000/api/v1/query',body).subscribe(data => {
      console.log(data);
      if (typeof(data) === 'object') {
        this.returnData = JSON.stringify(data, null, 4);
      } else {
      this.returnData = data;
      }
    },
    (error) => {
      console.error('error caught in component');
      this.returnData = error;
    })


  }
}
