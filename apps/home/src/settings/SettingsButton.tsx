import { AcButton } from '@mirumo/arcade-ui'

export function SettingsButton({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="ac:group ac:fixed ac:right-0 ac:bottom-0 ac:z-[110] ac:grid ac:size-24 ac:place-items-center">
      <AcButton
        variant="ghost"
        prefix="settings"
        aria-label="SETTINGS"
        title="SETTINGS"
        onClick={onOpen}
        className="ac:opacity-0 ac:transition-opacity ac:group-hover:opacity-100 ac:focus-visible:opacity-100 ac:[@media(hover:none)]:opacity-100"
      />
    </div>
  )
}
