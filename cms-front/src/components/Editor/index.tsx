import { Editor } from '@tinymce/tinymce-react';
import './style.css';

// TinyMCE so the global var exists
import 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model'
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/help/js/i18n/keynav/en';
// import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

interface State {
    content: string;
    setContent: (content: string) => void;
}

export default function TinyMceEditor({content, setContent}: State) {

    const handleEditorChange = (editorContent: any, editor: any) => {
        setContent(editorContent);
    };

    return (
        <Editor
            // onInit={(evt, editor) => editor.setContent(content)}
            value={content}
            apiKey='kzfocixhz6xbaijk2n4t7phpfcm281nmq6riahkqq7adb7fv'
            id={'tinymce_editor'}
            onEditorChange={handleEditorChange}
            init={{
                height: 600,
                width: "100%",
                menubar: false,
                placeholder: '본문을 작성해주세요.',
                paste_data_images: true,
                automatic_uploads: true,
                plugins: [
                    'lists',
                    'link',
                    'charmap',
                    'preview',
                    'searchreplace',
                    'fullscreen',
                    'table',
                    'code',
                    'help',
                    'emoticons',
                    'codesample',
                    'quickbars',
                    'textcolor', // 텍스트 색상 관련 플러그인 (형광펜)
                ],
                toolbar:
                    'undo redo | blocks | bold italic backcolor | bold italic forecolor | ' +
                    'alignleft aligncenter | alignright alignjustify | bullist numlist outdent indent | ' +
                    'lists table link charmap searchreplace | ' +
                    'emoticons fullscreen preview | ' +
                    'removeformat | help ',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
};

