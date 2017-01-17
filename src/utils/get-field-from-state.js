import get from './get';
import toPath from './to-path';
import getForm from './get-form';
import isPlainObject from './is-plain-object';
import invariant from 'invariant';

const defaultStrategy = {
  getForm,
  get,
  isObject: isPlainObject,
};

export default function getFieldFromState(state, modelString, s = defaultStrategy) {
  const stateForm = s.get(state, '$form');

  const form = (state && stateForm)
    ? state
    : s.getForm(state, modelString);

  if (!form) return null;

  if (!modelString.length) return form;

  invariant(form,
    'Could not find form for "%s" in the store.',
    modelString);

  const formPath = toPath(s.get(form, ['$form', 'model']));
  const fieldPath = toPath(modelString).slice(formPath.length);

  const field = s.get(form, fieldPath);

  if (!field) return null;

  const fieldForm = s.get(field, '$form');
  if (s.isObject(field) && fieldForm) return fieldForm;

  return field;
}
