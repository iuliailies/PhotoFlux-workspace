import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { ComboboxValue } from 'src/app/shared/components/combobox/combobox.component';
import { ActiveModal } from 'src/app/shared/modal/modal-ref.class';
import { Cluster } from 'src/app/shared/models/board.model';
import { Category } from 'src/app/shared/models/category.model';
import { BoardService } from 'src/app/shared/services/board.service';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-create-dashboard-modal',
  templateUrl: './create-dashboard-modal.component.html',
  styleUrls: ['./create-dashboard-modal.component.sass'],
})
export class CreateDashboardModalComponent implements OnInit {
  @ViewChild('nameInput') nameInput!: ElementRef;
  saving = false;
  categories: Category[] = [];
  categoryOptions: ComboboxValue[] = [];
  selectedCategories: string[] = [];
  categoriesLoading = false;
  categoriesError?: string;
  nameFocused = false;
  namePlaceholder = 'New Board';

  constructor(
    public activeModal: ActiveModal,
    private categoryService: CategoryService,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.getCategories();
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

  createBoard(): void {
    if (!this.selectedCategories.length) {
      return;
    }
    let clusters: Cluster[] = [];
    this.selectedCategories.forEach((category) => {
      clusters.push({
        category: category,
        position: {
          x: 0,
          y: 0,
        },
      });
    });
    this.boardService
      .createBoard(
        this.nameInput.nativeElement.value || this.namePlaceholder,
        clusters
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
