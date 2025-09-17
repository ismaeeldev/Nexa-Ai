import { createAvatar } from '@dicebear/core';
import { botttsNeutral, initials } from '@dicebear/collection';

interface Props {
    seed: string;
    variant: 'botttsNeutral' | 'initials';
}

export const generateAvatar = ({ seed, variant }: Props) => {
    let avatar;

    if (variant === 'botttsNeutral') {
        avatar = createAvatar(botttsNeutral, {
            seed,
            size: 128,
            radius: 50,
        });
    } else {
        avatar = createAvatar(initials, {
            seed,
            size: 128,
            radius: 50,
        });
    }

    return avatar.toDataUri();
};
