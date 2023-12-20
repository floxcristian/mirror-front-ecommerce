import { IBreadcrumbItem } from '../models/breadcrumb.interface';
import { ICategoryParams } from '../models/category-params.interface';

export class BreadcrumbUtils {
  static setBreadcrumbs(
    categoryParams: ICategoryParams,
    productName: string
  ): IBreadcrumbItem[] {
    const { firstCategory, secondCategory, thirdCategory } = categoryParams;
    const breadcrumbs: IBreadcrumbItem[] = [
      { label: 'Inicio', url: ['/', 'inicio'] },
    ];
    BreadcrumbUtils.addBreadcrumb({
      currentBreadcrumbs: breadcrumbs,
      category: firstCategory,
      path: [firstCategory],
    });
    BreadcrumbUtils.addBreadcrumb({
      currentBreadcrumbs: breadcrumbs,
      category: secondCategory,
      path: [firstCategory, secondCategory],
    });
    BreadcrumbUtils.addBreadcrumb({
      currentBreadcrumbs: breadcrumbs,
      category: thirdCategory,
      path: [firstCategory, secondCategory, thirdCategory],
    });
    breadcrumbs.push({
      label: BreadcrumbUtils.capitalize(productName),
      url: [''],
    });
    return breadcrumbs;
  }

  static addBreadcrumb(params: {
    currentBreadcrumbs: IBreadcrumbItem[];
    category: string;
    path: string[];
  }): void {
    const { currentBreadcrumbs, category, path } = params;
    if (!category) return;
    const formattedBreadcrumb = BreadcrumbUtils.formatBreadcrumb(
      category,
      path
    );
    currentBreadcrumbs.push(formattedBreadcrumb);
  }

  /**
   * Formatea un item breadcrumb.
   * @param category
   * @param path
   * @returns
   */
  static formatBreadcrumb(category: string, path: string[]): IBreadcrumbItem {
    const cleanedCategory = category.replaceAll(/-/g, ' ');
    return {
      label: BreadcrumbUtils.capitalize(cleanedCategory),
      url: ['/', 'inicio', 'productos', 'todos', 'categoria', ...path],
    };
  }

  /**
   * Pone en mayúscula la primera letra de un string.
   * @param value
   * @returns
   */
  static capitalize(value: string): string {
    const lowerValue = value.toLowerCase();
    return lowerValue.charAt(0).toUpperCase() + lowerValue.slice(1);
  }
}
