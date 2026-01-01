export interface ISubMenuItem {
  sub_menu_label: string;
  sub_menu_canonical: string;
  sub_menu_uuid: string;
}

export interface IMenuItem {
  main_menu_label: string;
  main_menu_label_type: string;
  main_menu_canonical: string;
  main_menu_uuid: string;
  sub_menu_items: ISubMenuItem[];
}
