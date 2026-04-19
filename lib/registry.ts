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
        component: Checkbox,
        defaultProps: { label: 'Checkbox label' },
        states: [
          { id: 'input-checkbox-unchecked',     label: 'Unchecked',     category: 'interactive', forcedClassName: '' },
          { id: 'input-checkbox-checked',       label: 'Checked',       category: 'interactive', forcedClassName: 'is-checked' },
          { id: 'input-checkbox-indeterminate', label: 'Indeterminate', category: 'interactive', forcedClassName: 'is-indeterminate' },
          { id: 'input-checkbox-disabled',      label: 'Disabled',      category: 'disabled',    forcedClassName: 'is-disabled' },
        ],
      },
      {
        id: 'input-select',
        label: 'Select',
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
        component: Badge,
        defaultProps: { children: 'Neutral', tone: 'neutral' },
        states: [
          { id: 'badge-neutral-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
      {
        id: 'badge-success',
        label: 'Badge · Success',
        component: Badge,
        defaultProps: { children: 'Success', tone: 'success' },
        states: [
          { id: 'badge-success-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
      {
        id: 'badge-warning',
        label: 'Badge · Warning',
        component: Badge,
        defaultProps: { children: 'Warning', tone: 'warning' },
        states: [
          { id: 'badge-warning-default', label: 'Default', category: 'interactive', forcedClassName: '' },
        ],
      },
      {
        id: 'badge-error',
        label: 'Badge · Error',
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
