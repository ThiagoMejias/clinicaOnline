import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent {

  @Input() user: any;
  @Output() close = new EventEmitter<void>();
  @Output() userOutput = new EventEmitter<void>();


  userForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      profileImage: ['']
    });
    console.log(this.userForm);
    
  }

  ngOnChanges() {
    if (this.user) {
      this.userForm.patchValue(this.user);
    } else {
      this.userForm.reset();
    }
  }

  saveUser() {
    if (this.userForm.valid) {
      if (this.user) {
        // this.userService.updateUser({ ...this.user, ...this.userForm.value }).subscribe(() => {
        //   this.close.emit();
        //});
      } else {
        // this.userService.addUser(this.userForm.value).subscribe(() => {
        //   this.close.emit();
        // });
      }
    }
  }

  closeModal() {
    this.close.emit();
  }
}
