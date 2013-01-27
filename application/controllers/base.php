<?php

class Base_Controller extends Controller
{

    public $layout = 'layout/index';
    protected $club=NULL;

    public function __construct()
    {
        Asset::add('reset', 'css/reset.css');
        Asset::add('style', 'css/style.css');

        // Third party styles
        Asset::add('slick-css', 'css/ingrid.css');

        // Third party libraries
        Asset::add('jquery', 'js/third-party/jquery.js');
        /*Asset::add('jquery-layout-js', 'js/third-party/jquery.layout.js');
        Asset::add('jquery-ui-js', 'js/third-party/jquery-ui-custom.min.js');

        Asset::add('jqGrid-js', 'js/third-party/jquery.jqGrid.js');*/
        Asset::add('table-js', 'js/table.js');
        Asset::add('setup-table-js', 'js/setup-table.js');

        // Personal
        Asset::add('member-js', 'js/member.js');

        parent::__construct();

        // Check if the user is logged in or not
        if(Auth::guest())
        {
            $this->layout->nest('login', 'layout/login');
        }
        else
        {
            $this->club=Auth::user();
            $this->layout->nest('login', 'layout/welcome', array('club'=>$this->club));
        }
    }

	/**
	 * Catch-all method for requests that can't be matched.
	 *
	 * @param  string    $method
	 * @param  array     $parameters
	 * @return Response
	 */
	public function __call($method, $parameters)
	{
		return Response::error('404');
	}

}