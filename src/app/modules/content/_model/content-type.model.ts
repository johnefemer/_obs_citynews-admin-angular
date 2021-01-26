import {BaseModel} from './base.model';

export interface ContentTypeModel extends BaseModel {

  id: number;
  name: string;
  slug: string;
  parent_type: string;
  child_type: string;
  editor_type: string;
  context: string;

  details: {
    cover_image: string;
    description: string;
    plural: string;
  };

  params: {
    router_slug: string,
    viewer: number,
    allow_duplicates: number,
    child_type_name: string
    rich_editor: string
    parent_type_name: string
    category_type: string
    category_picker: string
    with_image: string
    with_icon: string
    with_service: string
    append_title: string
  };

  plural_name: string;
  content_count: number;

  created_at: string;
  updated_at: string;
}
