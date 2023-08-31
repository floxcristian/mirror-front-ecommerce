import { Component } from '@angular/core';
import { navigation } from '../../../../../data/header-navigation';
import { NavigationLink } from '../../../../shared/interfaces/navigation-link';
import { DirectionService } from '../../../../shared/services/direction.service';
import { CategoryService } from '../../../../shared/services/category.service';
// import { error } from 'util';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-header-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent {
  items!: NavigationLink[];
  item!: NavigationLink;
  //  = navigation;
  // categorias =

  constructor(
    private direction: DirectionService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.optieneCategorias();
  }

  optieneCategorias() {
    this.categoryService.obtieneCategoriasHeader().subscribe(
      (r: any) => {
        // console.log(r);
        r.data.map((r: any) => {
          // let obj:NavigationLink;
          // obj.
          // this.item.push(obj);
        });
      },
      (e) => {
        this.toastr.error('Error de conexión con el servidor de la api');
      }
    );
  }

  mouseenter(event: MouseEvent): void {
    // return;
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const element: HTMLElement = event.target;
    const megamenu = element.querySelector(
      '.nav-links__megamenu'
    ) as HTMLElement;

    if (!megamenu) {
      return;
    }

    const container = megamenu.offsetParent;
    const containerWidth = container?.getBoundingClientRect().width;
    const megamenuWidth = megamenu.getBoundingClientRect().width;

    if (this.direction.isRTL()) {
      const itemPosition =
        containerWidth || 0 - (element.offsetLeft + element.offsetWidth);
      const megamenuPosition = Math.round(
        Math.min(itemPosition, containerWidth || 0 - megamenuWidth)
      );

      megamenu.style.right = megamenuPosition + 'px';
    } else {
      const itemPosition = element.offsetLeft;
      const megamenuPosition = Math.round(
        Math.min(itemPosition, containerWidth || 0 - megamenuWidth)
      );

      megamenu.style.left = megamenuPosition + 'px';
    }
  }
}
