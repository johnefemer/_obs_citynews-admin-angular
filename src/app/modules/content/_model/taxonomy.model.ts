import {BaseModel} from './base.model';

export interface TaxonomyModel extends BaseModel {

  id: number;
  taxonomy_type: string;
  context: string;
  name: string;
  slug: string;
  crumbs: string;
  ref_path: string;
  parent_id: number;
  display_order: number;
  photo_url: string;
  status: string;
  details: {
    notes: string;
    description: string;
    caption: string;
    special_text: string;
    thumb_url: string;
    placeholder: string;
    banner_url: string;
    google_taxonomy_id: string;
    google_taxonomy_path: string;
  };
  params: {
    taxonomy_type_id: string;
    taxonomy_type_name: string;
    has_meta: string;
    taxonomy_form: string;
  };

  parent_name: number;
  taxonomy_type_name: number;
  children_count: number;
  resource_ref: string;

  created_at: string;
  updated_at: string;
}
