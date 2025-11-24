import { UnitDTO } from "@models/unitDto";

export function arrayToTree(menuItems: UnitDTO[]) {
  const map = new Map<string, UnitDTO & { children: UnitDTO[] }>();

  // Đầu tiên, tạo một map với Id là khóa
  for (const item of menuItems) {
    map.set(item.id, { ...item, children: [] });
  }

  // Sau đó, duyệt qua các phần tử để xây dựng cây
  const menuTree: (UnitDTO & { children: UnitDTO[] })[] = [];
  for (const item of menuItems) {
    const menuItem = map.get(item.id);
    if (menuItem) {
      if (!item.parentId || !map.has(item.parentId)) {
        // Phần tử cấp cao nhất hoặc không có cha hợp lệ
        menuTree.push(menuItem);
      } else {
        // Phần tử con
        const parentItem = map.get(item.parentId);
        if (parentItem) {
          parentItem.children.push(menuItem);
        }
      }
    }
  }
  return menuTree;
}
