export type Feedback = {
  _id: string;
  locationId:
    | string
    | {
        _id: string;
        name?: string;
        type?: {
          _id: string;
          name: string;
          kind?: string;
        };
      };
  userName: string;
  rate: number;
  description: string;
  status?: 'pending' | 'approved';
  owner?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};
