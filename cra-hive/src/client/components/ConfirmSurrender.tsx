import { useState } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react'

export default function ConfirmSurrender({ surrender }) {
    const [open, setOpen] = useState(false);

    return (
      <>
          <Button size='mini' onClick={() => setOpen(true)}>
            <Icon name="flag outline"/>
            Surrender
        </Button>
        <Confirm
          open={open}
            onCancel={() => setOpen(false)}
            onConfirm={() => {
                setOpen(false);
                surrender();
            }} />
      </>
    )
}
