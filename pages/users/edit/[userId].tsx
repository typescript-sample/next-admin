import { Item } from 'onecore';
import * as React from 'react';
import { createModel, DispatchWithCallback, EditComponentParam, useEdit } from '@lib/react-hook-core';
import { formatPhone } from 'ui-plus';
import { emailOnBlur, Gender, handleError, handleSelect, inputEdit, phoneOnBlur, requiredOnBlur, Status } from '@lib/uione';
import { getMasterData, getUserService, User } from '@service/index';

interface InternalState {
  user: User;
  titleList: Item[];
  positionList: Item[];
}

const createUser = (): User => {
  const user = createModel<User>();
  user.status = Status.Active;
  return user;
};
const initialize = (id: string|null, load: (id: string|null) => void, set: DispatchWithCallback<Partial<InternalState>>) => {
  const masterDataService = getMasterData();
  Promise.all([
    masterDataService.getTitles(),
    masterDataService.getPositions()
  ]).then(values => {
    const [titleList, positionList] = values;
    set({ titleList, positionList }, () => load(id));
  }).catch(handleError);
};
const updateTitle = (ele: HTMLSelectElement, user: User, set: DispatchWithCallback<Partial<InternalState>>) => {
  handleSelect(ele);
  user.title = ele.value;
  user.gender = (user.title === 'Mr' ? Gender.Male : Gender.Female);
  set({ user });
};

const initialState: InternalState = {
  user: {} as User,
  titleList: [],
  positionList: []
};

const param: EditComponentParam<User, string, InternalState> = {
  createModel: createUser,
  initialize
};

 const UserForm = () => {
  const refForm = React.useRef();
  const { resource, state, setState, updateState, flag, save, updatePhoneState, back } = useEdit<User, string, InternalState>(refForm, initialState, getUserService(), inputEdit(), param);
  const user = state.user;
  return (
    <div className='view-container'>
      <form id='userForm' name='userForm' model-name='user' ref={refForm as any}>
        <header>
          <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={back} />
          <h2>{flag.newMode ? resource.create : resource.edit} {resource.user}</h2>
        </header>
        <div className='row'>
          <label className='col s12 m6'>
            {resource.user_id}
            <input
              type='text'
              id='userId'
              name='userId'
              value={user.userId || ''}
              readOnly={!flag.newMode}
              onChange={updateState}
              maxLength={20} required={true}
              placeholder={resource.user_id} />
          </label>
          <label className='col s12 m6'>
            {resource.display_name}
            <input
              type='text'
              id='displayName'
              name='displayName'
              value={user.displayName || ''}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder={resource.display_name} />
          </label>
          <label className='col s12 m6'>
          username
            <input
              type='text'
              id='username'
              name='username'
              value={user.username || ''}
              onChange={updateState}
              onBlur={requiredOnBlur}
              maxLength={40} required={true}
              placeholder='username' />
          </label>
          <label className='col s12 m6 flying'>
            {resource.person_title}
            <select
              id='title'
              name='title'
              value={user.title || ''}
              data-value
              onChange={e => updateTitle(e.target, state.user, setState)}>
              <option value=''>{resource.please_select}</option>
              )
              {state.titleList.map((item, index) => (
                <option key={index} value={item.value}>{item.text}</option>)
              )}
            </select>
          </label>
          <label className='col s12 m6 flying'>
            {resource.position}
            <select style={{ width: '99%' }}
              id='position'
              name='position'
              value={user.position || ''}
              data-value
              onChange={updateState}>
              <option value=''>{resource.please_select}</option>
              {
                state.positionList.map((item, index) => (<option key={index} value={item.value}>{item.text}</option>))
              }
            </select>
          </label>
          <label className='col s12 m6 flying'>
            {resource.phone}
            <input
              type='tel'
              id='phone'
              name='phone'
              value={formatPhone(user.phone) || ''}
              onChange={updatePhoneState}
              onBlur={phoneOnBlur}
              maxLength={17}
              placeholder={resource.phone} />
          </label>
          <label className='col s12 m6 flying'>
            {resource.email}
            <input
              type='text'
              id='email'
              name='email'
              data-type='email'
              value={user.email || ''}
              onChange={updateState}
              onBlur={emailOnBlur}
              maxLength={100}
              placeholder={resource.email} />
          </label>
          <label className='col s12 m6'>
            {resource.gender}
            <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  id='gender'
                  name='gender'
                  onChange={updateState}
                  disabled={user.title !== 'Dr'}
                  value={Gender.Male} checked={user.gender === Gender.Male} />
                {resource.male}
              </label>
              <label>
                <input
                  type='radio'
                  id='gender'
                  name='gender'
                  onChange={updateState}
                  disabled={user.title !== 'Dr'}
                  value={Gender.Female} checked={user.gender === Gender.Female} />
                {resource.female}
              </label>
            </div>
          </label>
          <div className='col s12 m6 radio-section'>
            {resource.status}
            <div className='radio-group'>
              <label>
                <input
                  type='radio'
                  id='active'
                  name='status'
                  onChange={updateState}
                  value={Status.Active} checked={user.status === Status.Active} />
                {resource.yes}
              </label>
              <label>
                <input
                  type='radio'
                  id='inactive'
                  name='status'
                  onChange={updateState}
                  value={Status.Inactive} checked={user.status === Status.Inactive} />
                {resource.no}
              </label>
            </div>
          </div>
        </div>
        <footer>
          {!flag.readOnly &&
            <button type='submit' id='btnSave' name='btnSave' onClick={save}>
              {resource.save}
            </button>}
        </footer>
      </form>
    </div>
  );
};

export default UserForm