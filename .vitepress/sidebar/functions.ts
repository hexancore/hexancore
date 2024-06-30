import type { DefaultTheme } from "vitepress";

export type HcSidebarItem = DefaultTheme.SidebarItem & { wip?: true; };

export function processWipTag(items: HcSidebarItem[]): HcSidebarItem[] {
  return items.map((i) => {
    if (i.wip) {
      i.text += '<span class="wip-label">WIP</span>';
    }
    if (i.items) {
      processWipTag(i.items);
    }
    return i;
  });
}

export function docFooterTextGenerator(sidebarItems: HcSidebarItem[], prefix = ''): HcSidebarItem[] {
  const sep = '>';
  sidebarItems.forEach((i) => {
    if (i.items) {
      docFooterTextGenerator(i.items, `${prefix} ${i.text} ${sep}`);
    } else {
      if (prefix.length !== 0) {
        i.docFooterText = `${prefix} ${i.text}`;
      }
    }
  });

  return sidebarItems;
}