import { Component, OnInit, signal } from "@angular/core";
import { HRService, UserDTOResponse } from '../../../../../core/services/HR/hr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { GenderPipe } from "../../../../../shared/pipes/gender.pipe";
import { ToastrService } from 'ngx-toastr';
import { CustomBootstrapModal } from "../../../../../shared/components/CustomBootstrapModal";

interface UserUI extends UserDTOResponse {
  isEditing: boolean;
}

@Component({
  selector: "it-setting-user",
  standalone: true,
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
  imports: [CommonModule, FormsModule, GenderPipe, CustomBootstrapModal],
})

export class UserComponent implements OnInit {
  public users: UserUI[] = []
  public searchKeyword: string = '';
  public selectedUser: UserUI | null = null;
  isModalVisible = signal(false);
  confirmationMessage = signal('');
  modalTitle = signal('Warning');
  modalMessage = signal('Are you sure you want to proceed with this action?');
  warningDetails = signal('This action may have significant consequences. Please confirm your choice');
  details = signal<string[] | null>(null);

  public genderDataSource = [
    { value: 1, label: 'Nam' },
    { value: 2, label: 'Nữ' },
    { value: 3, label: 'Khác' },
  ];

  constructor(private hrService: HRService, private toastr: ToastrService) {
    console.log("UserComponent constructor called");
  }

  openModal(): void {
    this.confirmationMessage.set('');
    // Đặt Signal thành TRUE để mở Modal
  }

  ifEnter(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.search();
    }
  }

  search(): void {

    this.getListUsers(this.searchKeyword);
  }

  editUser(user: UserUI): void {
    this.users = this.users.map(u =>
      u.id === user.id ? { ...u, isEditing: true } : { ...u, isEditing: false }
    );
  }

  updateUser(user: UserUI): void {
    this.selectedUser = user;
    this.isModalVisible.set(true);
  }

  handleConfirm(): void {
    if (this.selectedUser) {
      this.hrService.updateUser(this.selectedUser).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.toastr.success('User updated successfully!', 'Success');
            this.search();
          }
        },
        error: (err) => {
          console.error("Error updating user:", err);
        }
      });
    }
    this.confirmationMessage.set('Confirmed and data processing is underway!');
    this.isModalVisible.set(false);
    console.log('User confirmed the warning.');
  }

  cancelEdit(user: UserUI): void {
    this.users = this.users.map(u =>
      u.id === user.id ? { ...u, isEditing: false } : u
    );
  }

  emitFromPopup(): void {
    console.log("Received confirmation from modal popup");
    this.isModalVisible.set(false);
  }

  deleteUser(user: UserUI): void {
    if (confirm(`Bạn có chắc chắn muốn xóa user "${user.fullName}"?`)) {
      console.log("Delete user:", user);
      this.hrService.deleteUser(user.id).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.toastr.success('User deleted successfully!', 'SuccessF');
            this.users = this.users.filter(u => u.id !== user.id);
            console.log("User deleted successfully:", user);
          }
        },
        error: (err) => {
          console.error("Error deleting user:", err);
        }
      });
    }
  }
  //#endregion

  getListUsers(keyword: string = ''): void {
    this.hrService.getListUsers({ keyword: keyword }).subscribe({
      next: (res) => {
        this.users = res.data.items.map(u => ({
          ...u,
          isEditing: false
        }));
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      }
    });
  }

  ngOnInit(): void {
    this.getListUsers();
  }
}