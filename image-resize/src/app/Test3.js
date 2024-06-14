import React, { useState, useRef, useEffect } from 'react';
import {
  Button,
  Select,
  Input,
  Upload,
  Modal,
  Menu,
  Space,
  Flex,
  ColorPicker,
} from 'antd';
import Moveable from 'react-moveable';
import {
  UploadOutlined,
  SaveOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

const { Option } = Select;

const DesignTool = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#242958');
  const [showNfcOverlay, setShowNfcOverlay] = useState(false);
  const [stickerShape, setStickerShape] = useState('rectangle');
  const containerRef = useRef(null);
  const mainContainerRef = useRef(null);

  const addElement = (type, content = null) => {
    const newElement = {
      id: elements.length,
      type,
      content: content || (type === 'text' ? 'Edit Me' : null),
      width: 100,
      height: 100,
      x: 200,
      y: 200,
      backgroundColor: 'transparent',
      color: '#ffffff',
      border: '1px solid grey',
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id, newProps) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const handleElementClick = (e, id) => {
    // e.stopPropagation();

    setSelectedElement(id);
  };

  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      addElement('image', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const saveDesign = () => {
    setSelectedElement(null);
    setTimeout(() => {
      const design = { elements, backgroundColor, stickerShape };
      localStorage.setItem('nfcStickerDesign', JSON.stringify(design));
      Modal.success({ content: 'Design saved successfully!' });

      domtoimage.toPng(mainContainerRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'nfc-sticker-design.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error capturing image:', error);
      });
    }, 500);
  };

  const loadDesign = () => {
    const savedDesign = localStorage.getItem('nfcStickerDesign');
    if (savedDesign) {
      const { elements, backgroundColor, stickerShape } =
        JSON.parse(savedDesign);
      setElements(elements);
      setBackgroundColor(backgroundColor);
      setStickerShape(stickerShape);
      Modal.success({ content: 'Design loaded successfully!' });
    } else {
      Modal.error({ content: 'No saved design found!' });
    }
  };

  const handleKeyDown = (e) => {
    if (selectedElement !== null) {
      const step = 1;
      const element = elements.find((el) => el.id === selectedElement);
      if (e.key === 'ArrowUp') {
        updateElement(selectedElement, { y: element.y - step });
      } else if (e.key === 'ArrowDown') {
        updateElement(selectedElement, { y: element.y + step });
      } else if (e.key === 'ArrowLeft') {
        updateElement(selectedElement, { x: element.x - step });
      } else if (e.key === 'ArrowRight') {
        updateElement(selectedElement, { x: element.x + step });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedElement, elements]);

  const getStickerShapeStyle = () => {
    switch (stickerShape) {
      case 'round':
        return { borderRadius: '50%' };
      case 'square':
        return { borderRadius: '0' };
      default:
        return {};
    }
  };
  console.log('selectedElement', elements[selectedElement]);
  return (
    <Flex vertical justify={'space-around'} gap={5}>
      <Flex vertical justify={'space-around'} gap={10}>
        <Menu mode='horizontal'>
          <Flex gap={3}>
            <Menu.Item key='save' icon={<SaveOutlined />} onClick={saveDesign}>
              Save Design
            </Menu.Item>
            <Menu.Item
              key='load'
              icon={<FolderOpenOutlined />}
              onClick={loadDesign}
            >
              Load Design
            </Menu.Item>
          </Flex>
        </Menu>
        <div className='toolbar'>
          <Flex gap='middle'>
            <Button type='primary' onClick={() => addElement('text')}>
              Add Text
            </Button>
            <Upload
              type='primary'
              beforeUpload={() => false}
              onChange={handleUpload}
            >
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
            {/* <Input
            style={{ width: "100%" }}
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            title="Background Color"
          /> */}
            <ColorPicker
              defaultValue='#242958'
              onChange={(value, hex) => setBackgroundColor(hex)}
            />
            <Select
              defaultValue='rectangle'
              style={{ width: 120 }}
              onChange={setStickerShape}
            >
              <Option value='rectangle'>Rectangle</Option>
              <Option value='round'>Round</Option>
              <Option value='square'>Square</Option>
            </Select>
            <Button onClick={() => setShowNfcOverlay(!showNfcOverlay)}>
              Toggle NFC Overlay
            </Button>
          </Flex>
        </div>
        {elements[selectedElement]?.type == 'text' && (
          <Flex gap='2px'>
            <Button
              type='default'
              onClick={() => document.execCommand('bold', false, null)}
            >
              <b>b</b>
            </Button>
            <Button
              type='default'
              onClick={() => document.execCommand('italic', false, null)}
            >
              <i>I</i>
            </Button>
            <Button
              type='default'
              onClick={() => document.execCommand('underline', false, null)}
            >
              <u>U</u>
            </Button>
          </Flex>
        )}
      </Flex>
      <div ref={mainContainerRef}>
        <div
          className='design-area'
          style={{ ...getStickerShapeStyle(), backgroundColor }}
          ref={containerRef}
          // onClick={(e) => {setSelectedElement(null)}}
        >
          {elements.map((el, index) => (
            <div
              key={index}
              // contentEditable
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                backgroundColor: el.backgroundColor,
                color: '#fff',
              }}
              onClick={(e) => handleElementClick(e, el.id)}
            >
              {el.type === 'text' && <span>{el.content}</span>}
              {el.type === 'image' && (
                <img
                  src={el.content}
                  alt='logo'
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          ))}

          {selectedElement !== null && (
            <Moveable
              target={containerRef.current.children[selectedElement]}
              draggable={true}
              resizable={true}
              onBound={(e) => {
                console.log(e);
              }}
              // flushSync={flushSync}
              onDrag={({ target, left, top, transform }) => {
                // target.style.transform = transform;
                updateElement(selectedElement, { x: left, y: top });
              }}
              onResize={({ target, width, height, drag }) => {
                const element = elements.find(
                  (el) => el.id === selectedElement
                );
                const newFontSize =
                  (width / element.width) * (element.fontSize || 16);
                // updateElement(selectedElement, { width, height, x: drag.left, y: drag.top, fontSize: newFontSize });

                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
                target.style.fontSize = newFontSize + 'px';
                target.style.transform = drag.transform;
                updateElement(selectedElement, {
                  width,
                  height,
                  x: drag.left,
                  y: drag.top,
                  fontSize: newFontSize,
                });
              }}
              onRotate={(e) => {
                e.target.style.transform = e.afterTransform;
              }}
              renderDirections={['se']}
              // renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
              rotatable={true}
              // edge={false}
              keepRatio={false}
              minWidth={100}
              minHeight={100}
              maxWidth={600}
              maxHeight={600}
              throttleDrag={1}
              edgeDraggable={false}
              startDragRotate={0}
              throttleDragRotate={0}
              snappable={true}
              bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: 'css' }}
              edge={[]}
            />
          )}
        </div>
      </div>

      {showNfcOverlay && (
        <div className='nfc-overlay'>
          <img
            src='/nfc-overlay.png'
            alt='NFC Overlay'
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      <style jsx>{`
        .toolbar {
          margin-bottom: 20px;
        }
        .design-area {
          position: relative;
          width: 700px;
          height: 700px;
          border: 1px solid #ccc;
          overflow: hidden;
        }
        .nfc-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </Flex>
  );
};

export default DesignTool;
