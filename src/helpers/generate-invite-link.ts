import { CLIENT_APP_URL } from '../services/api/config';

export function generateInviteLinkString(
  invite_id: string | number,
  invite_code: string
  // invitationType: 'personal' | 'toOrganisation',
  // userId: number,
  // organisationId: number
) {
  const params = new URLSearchParams({
    invite_id: invite_id.toString(),
    invite_code,
    // invitationType,
    // o: organisationId.toString(),
    // u: userId.toString(),
  });

  return `${CLIENT_APP_URL}?${params.toString()}`;
}
