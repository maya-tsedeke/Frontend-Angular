import { Component, OnInit} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, map, mergeMap } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  pageTitle: string | undefined;
sideNavStatus:boolean=false;
  
  constructor(private modalService: NgbModal,private router: Router) {
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router),
      map((router) => {
        let route = router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    )
    .subscribe((event) => this.pageTitle = event['title']);
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

 


}
