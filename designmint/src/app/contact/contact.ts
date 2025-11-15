import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
constructor(private http: HttpClient) {}

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.contactForm.invalid) return;

  this.http.post('http://localhost:3000/contact', this.contactForm.value)
  .subscribe({
    next: (res) => {
      console.log('Server response:', res);
      alert('Message sent successfully');
      this.contactForm.reset();
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Something went wrong, please try again');
    }
  });



    }}
