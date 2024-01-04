import {
  Roster,
  RosterCell,
  RosterGroup,
  RosterHeader,
  useAttendeeStatus,
  useRosterState,
} from 'amazon-chime-sdk-component-library-react';
const Menu = () => (
  <div className="shadow">
    <div
      className="hover:bg-slate-400 hover:text-white transition duration-500 text-slate-700"
      style={{
        padding: '.5rem 1rem',
        cursor: 'pointer',
      }}
    >
      Message user
    </div>
    <div
      className="hover:bg-slate-400 hover:text-white transition duration-500 text-slate-700"
      style={{
        padding: '.5rem 1rem',
        cursor: 'pointer',
      }}
    >
      Kick user
    </div>
  </div>
);

const UserListItem = ({
  name,
  atendeeId,
}: {
  atendeeId: string;
  name: string;
}) => {
  console.log('list item', atendeeId);
  const { muted, videoEnabled } = useAttendeeStatus(atendeeId);

  const uas = useAttendeeStatus(atendeeId);

  console.log('uas', uas);

  return (
    // <div
    //   className="flex flex-row bg-emerald-300"
    //   style={{
    //     color: 'black',
    //   }}
    // >
    //   {atendeeId}
    //   {muted && 'mic disabled'}
    //   {!videoEnabled && 'video disabled'}
    // </div>
    <div className="">
      <RosterCell
        className="rounded"
        css="box-shadow: 0px 0px 2px 0px #333333"
        name={atendeeId}
        // subtitle="Regional Manager"
        muted={false}
        videoEnabled={false}
        poorConnection={false}
        sharingContent={false}
        menu={<Menu />}
      />

      {muted && 'mic disabled'}
      {!videoEnabled && 'video disabled'}
    </div>
    // <RosterCell
    //   name="Mike the Magic"
    //   subtitle="Magician"
    //   videoEnabled={videoEnabled}
    //   muted={muted}
    // />
  );
};

export const ListUsers = () => {
  const { roster } = useRosterState();

  console.log('roster', roster);

  const atendees = Object.keys(roster);

  console.log('sad', atendees);

  return (
    <div className="fixed right-0 h-full top-0">
      <Roster className="" css="position:fixed; top:0; right:0; height:90vh">
        <RosterHeader
          title="Present"
          badge={atendees.length}
          onClose={() => {}}
          searchValue=""
          onSearch={() => {}}
        />
        <RosterGroup className="">
          {atendees.map((r) => (
            <UserListItem key={r} name="Random Name" atendeeId={r} />
          ))}
        </RosterGroup>
      </Roster>
    </div>
  );
};
