import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  showProfileMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileMenu = document.querySelector('.profile-menu');
    const profileButton = document.querySelector('.profile-button');
    
    if (!profileMenu?.contains(event.target as Node) && 
        !profileButton?.contains(event.target as Node)) {
      this.showProfileMenu = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // Pour le changement de background des liens de navigation
  changeBackground(element: HTMLElement) {
    const links = document.querySelectorAll('.flex a');
    links.forEach(link => {
      link.classList.remove('bg-gray-400');
    });
    element.classList.add('bg-gray-400');
  }
}