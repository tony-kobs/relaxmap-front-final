export type Feedback = {
  _id: string;
  locationId: string;
  userName: string;
  rate: number;
  description: string;
  status: 'pending' | 'approved';
};
