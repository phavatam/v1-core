import { Component, ChangeDetectionStrategy, input, output, ElementRef, viewChild, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

// Define the type for the warning details data
interface WarningDetail {
  id: string;
  info: string;
}

@Component({
  selector: 'custom-bootstrap-modal',
  imports: [CommonModule],
  template: `
    <div
      #modalElement
      class="modal fade"
      id="popupModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content border-2 border-orange-400 rounded-xl shadow-2xl">
          <!-- HEADER -->
          <div class="modal-header bg-orange-50 border-b border-orange-200">
            <h5 class="text-xl font-extrabold text-[#ff9500] flex items-center" id="popupHeader">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle mr-2">
                <path d="m21.73 18.27-9-15a2 2 0 0 0-3.46 0l-9 15a2 2 0 0 0 1.73 2.73h18a2 2 0 0 0 1.73-2.73Z"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
              {{ title() }}
            </h5>
            <button type="button" class="btn-close" aria-label="Close" (click)="onClose()"></button>
          </div>

          <!-- BODY -->
          <div class="modal-body p-6">
            <p class="text-gray-900 mb-4 font-semibold">{{ message() }}</p>
            
            <div *ngIf="details() && details() != null" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg popup-warning-style1" role="alert">
              <p class="font-bold mb-2 text-sm">Warning OT Proposal Hours: </p>
              <ng-container *ngFor="let detail of details(); let i = index">
                <p class="text-xs mb-1">
                  <span class="font-semibold">{{ detail.id }}: </span> {{ detail.info }}
                </p>
              </ng-container>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="modal-footer border-t border-gray-200 bg-gray-50 p-3">
            <div class="w-full flex justify-end gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary rounded-full poppins-regular transition duration-150 ease-in-out hover:bg-gray-200 px-4 py-2 text-sm text-gray-700"
                (click)="onClose()"
              >
                <i class="fa-solid fa-xmark text-red-600"></i>&nbsp;Close
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary rounded-full poppins-regular transition duration-150 ease-in-out hover:bg-gray-200 px-4 py-2 text-sm text-gray-700"
                data-bs-dismiss="modal"
                (click)="onConfirm()"
              >
                <i class="fa-solid fa-check text-green-600"></i>&nbsp;Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Minor styling adjustments for correct display */
      .modal-header {
        border-bottom: 1px solid #dee2e6;
      }
      .modal-footer {
        border-top: 1px solid #dee2e6;
      }
    `,
  ],
  // Use Signals and OnPush for performance optimization
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomBootstrapModal {
  // Output: Event emitted when the user clicks Close
  closeAction = output<void>();
  onClose(): void {
    if (this.bsModal) {
      this.bsModal.hide();
    }
    this.closeAction.emit();
  }
  // Input: Data for the Modal
  title = input<string>('WARNING');
  message = input<string>('Please review the following issues before proceeding.');
  details = input<WarningDetail[] | null>([]);

  // Input: Controls the visibility state
  isVisible = input<boolean>(false);

  // Output: Event emitted when the user clicks Confirm
  confirmAction = output<void>();

  // Get a reference to the modal DOM element
  modalElement = viewChild<ElementRef<HTMLDivElement>>('modalElement');

  private bsModal: any;

  constructor() {
    // Effect to listen for changes in isVisible and control the Modal instance
    effect(() => {
      const isVisible = this.isVisible();
      if (this.modalElement()?.nativeElement && typeof bootstrap !== 'undefined') {
        if (!this.bsModal) {
          // Initialize the Bootstrap Modal instance on first change
          this.bsModal = new bootstrap.Modal(this.modalElement()!.nativeElement, {});
        }

        if (isVisible) {
          this.bsModal.show();
        } else {
          this.bsModal.hide();
        }
      }
    }, { allowSignalWrites: true });
  }

  onConfirm(): void {
    // Hide the modal after user confirmation
    if (this.bsModal) {
      this.bsModal.hide();
    }
    // Emit the event to the parent component
    this.confirmAction.emit();
  }
}