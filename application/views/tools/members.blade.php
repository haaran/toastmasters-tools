@section('page-name')
    Member List
@endsection

@section('content')

    <table id="members">
        <thead>
            <tr>
                <th class="hidden"></th>
                <th>Name</th>
                <th>Title</th>
                <th>Email Address</th>
                <th>Month of Birth</th>
                <th>Join Date</th>
                <th>Last Attended</th>
                <th>Last Speech</th>
                <th>Speech Number</th>
            </tr>
        </thead>
        <tbody>
            @foreach($members as $member)
                <tr>
                    <td class="hidden">{{ $member->id }}</td>
                    <td>{{ $member->name }}</td>
                    <td>{{ $member->designation }}</td>
                    <td>{{ $member->email_address }}</td>
                    <td>{{ date("F",mktime(0,0,0,$member->month_of_birth,0,0)) }}</td>
                    <td>{{ $member->join_date }}</td>
                    <td>{{ $member->last_attended }}</td>
                    <td>{{ $member->last_speech }}</td>
                    <td>{{ $member->speech_description }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

@endsection