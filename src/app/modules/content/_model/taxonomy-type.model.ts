import {BaseModel} from './base.model';

export interface TaxonomyTypeModel extends BaseModel {

  id: number;
  parent_type: string;
  name: string;
  slug: string;
  context: string;

  details: {
    description: string;
    plural: string;
  };

  params: {
    taxonomy_form: string,
    allow_duplicates: number,
    has_meta: number,
    router_slug: string
  };

  plural_name: string;
  terms_count: number;

  created_at: string;
  updated_at: string;
}
