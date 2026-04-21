import type { ComponentGroup } from './types'
import { Button }        from '@/components/ui/Button'
import { TextInput }     from '@/components/ui/TextInput'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Checkbox }      from '@/components/ui/Checkbox'
import { Select }        from '@/components/ui/Select'
import { Badge }         from '@/components/ui/Badge'
import { Link }          from '@/components/ui/Link'

export const componentRegistry: ComponentGroup[] = [
  {
    id: 'buttons',
    label: 'Buttons',
    variants: [
      {
        id: 'button-primary',
        label: 'Primary',
        purpose: 'The primary call-to-action. Use for the single most important action on a screen — there should only ever be one per view.',
        component: Button,
        defaultProps: { children: 'Button', variant: 'primary' },
        states: [
          { id: 'button-primary-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'button-primary-hover',    label: 'Hover',    category: 'interactive', forcedClassName: 'is-hovered' },
          { id: 'button-primary-focus',    label: 'Focus',    category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'button-primary-active',   label: 'Active',   category: 'interactive', forcedClassName: 'is-active' },
          { id: 'button-primary-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
          { id: 'button-primary-loading',  label: 'Loading',  category: 'loading',     forcedClassName: 'is-loading' },
        ],
      },
      {
        id: 'button-secondary',
        label: 'Secondary',
        purpose: 'A lower-emphasis alternative to the primary button. Use for secondary or supplementary actions that exist alongside a primary action.',
        component: Button,
        defaultProps: { children: 'Button', variant: 'secondary' },
        states: [
          { id: 'button-secondary-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'button-secondary-hover',    label: 'Hover',    category: 'interactive', forcedClassName: 'is-hovered' },
          { id: 'button-secondary-focus',    label: 'Focus',    category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'button-secondary-active',   label: 'Active',   category: 'interactive', forcedClassName: 'is-active' },
          { id: 'button-secondary-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
      {
        id: 'button-destructive',
        label: 'Destructive',
        purpose: 'For actions that could have irreversible or harmful effects on the user\'s data, such as delete or remove. Use sparingly to preserve its urgency.',
        component: Button,
        defaultProps: { children: 'Delete', variant: 'destructive' },
        states: [
          { id: 'button-destructive-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'button-destructive-hover',    label: 'Hover',    category: 'interactive', forcedClassName: 'is-hovered' },
          { id: 'button-destructive-focus',    label: 'Focus',    category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'button-destructive-active',   label: 'Active',   category: 'interactive', forcedClassName: 'is-active' },
          { id: 'button-destructive-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
    ],
  },
  {
    id: 'form-inputs',
    label: 'Form Inputs',
    variants: [
      {
        id: 'input-text',
        label: 'Text Input',
        purpose: 'A single-line text field for collecting short-form user input such as names, emails, or search queries.',
        component: TextInput,
        defaultProps: { placeholder: 'Placeholder', label: 'Label' },
        states: [
          { id: 'input-text-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'input-text-focus',    label: 'Focus',    category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'input-text-filled',   label: 'Filled',   category: 'interactive', forcedClassName: 'is-filled' },
          { id: 'input-text-error',    label: 'Error',    category: 'validation',  forcedClassName: 'is-error' },
          { id: 'input-text-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
      {
        id: 'input-password',
        label: 'Password Input',
        purpose: 'A text field that masks its contents for sensitive credentials. Includes a visibility toggle so users can verify what they\'ve typed.',
        component: PasswordInput,
        defaultProps: { placeholder: 'Password', label: 'Password' },
        states: [
          { id: 'input-password-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'input-password-focus',    label: 'Focus',    category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'input-password-error',    label: 'Error',    category: 'validation',  forcedClassName: 'is-error' },
          { id: 'input-password-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
      {
        id: 'input-checkbox',
        label: 'Checkbox',
        purpose: 'A binary selection control for boolean choices or multi-select lists. Supports an indeterminate state for parent checkboxes with partially-selected children.',
        component: Checkbox,
        defaultProps: { label: 'Checkbox label' },
        states: [
          { id: 'input-checkbox-unchecked',     label: 'Unchecked',     category: 'interactive', forcedClassName: '' },
          { id: 'input-checkbox-checked',       label: 'Checked',       category: 'interactive', forcedClassName: 'is-checked' },
          { id: 'input-checkbox-indeterminate', label: 'Indeterminate', category: 'interactive', forcedClassName: 'is-indeterminate' },
          { id: 'input-checkbox-focus',         label: 'Focus',         category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'input-checkbox-disabled',      label: 'Disabled',      category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
      {
        id: 'input-select',
        label: 'Select',
        purpose: 'A dropdown control for choosing a single option from a predefined list. Use when the option set is too large for radio buttons but small enough to enumerate.',
        component: Select,
        defaultProps: { placeholder: 'Select an option', label: 'Label' },
        states: [
          { id: 'input-select-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'input-select-open',     label: 'Open',     category: 'interactive', forcedClassName: 'is-open' },
          { id: 'input-select-filled',   label: 'Filled',   category: 'interactive', forcedClassName: 'is-filled' },
          { id: 'input-select-error',    label: 'Error',    category: 'validation',  forcedClassName: 'is-error' },
          { id: 'input-select-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    variants: [
      {
        id: 'badge-neutral',
        label: 'Badge · Neutral',
        purpose: 'A non-semantic status label with no implied urgency. Use for informational tags, categories, or counts.',
        component: Badge,
        defaultProps: { children: 'Neutral', tone: 'neutral' },
        states: [
          { id: 'badge-neutral-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
      {
        id: 'badge-success',
        label: 'Badge · Success',
        purpose: 'Signals a positive outcome, completed action, or healthy status. Use when the user needs confirmation that something worked.',
        component: Badge,
        defaultProps: { children: 'Success', tone: 'success' },
        states: [
          { id: 'badge-success-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
      {
        id: 'badge-warning',
        label: 'Badge · Warning',
        purpose: 'Indicates a potential issue that requires attention but is not yet critical. Use to surface degraded or at-risk states before they become errors.',
        component: Badge,
        defaultProps: { children: 'Warning', tone: 'warning' },
        states: [
          { id: 'badge-warning-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
      {
        id: 'badge-error',
        label: 'Badge · Error',
        purpose: 'Marks a failure, critical issue, or invalid state that requires immediate user action. Use sparingly to preserve its urgency.',
        component: Badge,
        defaultProps: { children: 'Error', tone: 'error' },
        states: [
          { id: 'badge-error-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    variants: [
      {
        id: 'link',
        label: 'Link',
        purpose: 'An inline navigational element for text-based navigation within content or to external destinations. Avoid using links where a button action is more appropriate.',
        component: Link,
        defaultProps: { children: 'Link text', href: '#' },
        states: [
          { id: 'link-default',  label: 'Default',  category: 'interactive', forcedClassName: '' },
          { id: 'link-hover',    label: 'Hover',    category: 'interactive', forcedClassName: 'is-hovered' },
          { id: 'link-focus',    label: 'Focus',    category: 'interactive', forcedClassName: 'is-focused' },
          { id: 'link-visited',  label: 'Visited',  category: 'interactive', forcedClassName: 'is-visited' },
          { id: 'link-disabled', label: 'Disabled', category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
    ],
  },
]
