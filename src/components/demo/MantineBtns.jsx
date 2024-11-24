import { Button, rem, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
// import { IconCopy, IconCheck } from '@tabler/icons-react';
import { FaFileDownload, FaCheckCircle } from 'react-icons/fa';

const ButtonCopy = () => {
    const clipboard = useClipboard();
    return (
        <Tooltip
            label="Link copied!"
            offset={5}
            position="bottom"
            radius="xl"
            transitionProps={{ duration: 100, transition: 'slide-down' }}
            opened={clipboard.copied}
        >
            <Button
                variant="light"
                rightSection={
                    clipboard.copied ? (
                        <FaFileDownload style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                    ) : (
                        <FaCheckCircle style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                    )
                }
                radius="xl"
                size="md"
                styles={{
                    root: { paddingRight: rem(14), height: rem(48) },
                    section: { marginLeft: rem(22) },
                }}
                onClick={() => clipboard.copy('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
            >
                Copy link to clipboard
            </Button>
        </Tooltip>
    );
};

export default ButtonCopy;
