import { NavigatorScreenParams } from '@react-navigation/native';

export type CitizenTabParamList = {
  Home: undefined;
  MyReports: undefined;
  Profile: undefined;
};

export type CitizenStackParamList = {
  CitizenTabs: NavigatorScreenParams<CitizenTabParamList>;
  ReportSymptoms: undefined;
};

export type AgentTabParamList = {
  Home: undefined;
  Visitas: undefined;
  Mapa: undefined;
  Profile: undefined;
};

export type AgentStackParamList = {
  AgentTabs: NavigatorScreenParams<AgentTabParamList>;
  RegisterVisit: undefined;
};

export type AuthorityTabParamList = {
  Dashboard: undefined;
  Estadísticas: undefined;
  Mapa: undefined;
  Profile: undefined;
};

export type AuthorityStackParamList = {
  AuthorityTabs: NavigatorScreenParams<AuthorityTabParamList>;
};
