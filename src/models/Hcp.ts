interface Hcp {
  id: number;
  name?: string;
  hospital?: string;
  department?: string;
  professional_title?: string;
  kvp_professional_title?: string;
  admin_title?: string;
  kvp_admin_title?: string;
  academic_title?: string;
  kvp_academic_title?: string;
  supervisor_title?: string;
  kvp_supervisor_title?: string;
  research_territory?: string;
  max_education_degree?: string;
  data_state: number;
  revisee_owner?: User;
  association_list?: HcpAssociation[];
  award_list?: HcpAward[];
  education_list?: HcpEducation[];
  honour_list?: HcpHonour[];
  introduction?: string;
}