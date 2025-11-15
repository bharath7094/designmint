import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Navbar } from './navbar/navbar';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Open } from './open/open';
import { Projects } from './projects/projects';

export const routes: Routes = [
    { path : '' , component : Open},
    { path : 'home' , component : Home},
    { path : 'navbar' , component : Navbar},
    { path : 'about' , component : About},
    { path : 'contact' , component : Contact},
    { path : 'projects' , component : Projects}
];
