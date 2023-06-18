import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ComboboxValue } from 'src/app/shared/components/combobox/combobox.component';
import { getImageDimensions } from 'src/app/shared/helpers/image-dimensions';
import { ActiveModal } from 'src/app/shared/modal/modal-ref.class';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { PhotoService } from 'src/app/shared/services/photo.service';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.sass'],
})
export class PhotoModalComponent implements OnInit {
  saving = false;
  categories: Category[] = [];
  categoryOptions: ComboboxValue[] = [];
  selectedCategories: string[] = [];
  categoriesLoading = false;
  categoriesError?: string;
  file?: File;
  showWarning = false;

  constructor(
    public activeModal: ActiveModal,
    private categoryService: CategoryService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  onFileChanged(event?: File): void {
    this.file = event;
    if (!this.file) {
      this.showWarning = false;
      return;
    }
    // if (this.file.)
    getImageDimensions(this.file).then((dimensions) => {
      const { width, height } = dimensions;
      this.showWarning = width > 1080 || height > 1080;
    });
  }

  getCategories(): void {
    this.categoriesLoading = true;
    this.categoryService
      .listCategories()
      .pipe(
        finalize(() => {
          this.categoriesLoading = false;
        })
      )
      .subscribe(
        (resp) => {
          this.categories = resp;
          resp.forEach((category) => {
            this.categoryOptions.push({
              value: category.id,
              placeholder: category.name,
            } as ComboboxValue);
          });
        },
        (err) => {
          this.categoriesError = err;
        }
      );
  }

  uploadPhoto(): void {
    if (!this.file) {
      return;
    }
    this.saving = true;
    this.photoService
      .uploadPhoto(this.selectedCategories, this.file)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(
        (resp) => {
          this.activeModal.close(resp);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
