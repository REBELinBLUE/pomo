// Code to actually run on the ESP32, written by @aurimasniekis
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define DEVICE_NAME "Pomo Light #1"

#define RED_PIN 5
#define GREEN_PIN 18
#define BLUE_PIN 19

typedef struct {
    uint8_t red;
    uint8_t green;
    uint8_t blue;
} RGBValue;

RGBValue colors;
bool packetOpened;
uint8_t packetPosition;

void setColors(uint8_t red, uint8_t green, uint8_t blue) {
    ledcWrite(1, red);
    ledcWrite(2, green);
    ledcWrite(3, blue);
}

void updateColors(RGBValue values) {
    setColors(values.red, values.green, values.blue);
}

BLEServer *pServer = NULL;
BLECharacteristic * pTxCharacteristic;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint8_t txValue = 0;

#define SERVICE_UUID           "6E400001-B5A3-F393-E0A9-E50E24DCCA9E" // UART service UUID
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        setColors(0, 0, 0);
        for (int i = 0; i < 10; i++) {
            setColors(0, 0, 255);
            delay(50);
            setColors(0, 0, 0);
            delay(50);
        }

        setColors(0, 0, 0);
        deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
        setColors(0, 0, 0);
        for (int i = 0; i < 10; i++) {
            setColors(255, 0, 0);
            delay(50);
            setColors(0, 0, 0);
            delay(50);
        }

        setColors(0, 0, 0);
        deviceConnected = false;
    }
};

class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        std::string rxValue = pCharacteristic->getValue();

        if (rxValue.length() > 0) {
            for (int i = 0; i < rxValue.length(); i++) {
                uint8_t receivedChar = (uint8_t) rxValue[i];

                if (packetOpened) {
                    switch (packetPosition) {
                        case '0':
                            colors.red = receivedChar;
                            packetPosition = 'R';
                            break;

                        case 'R':
                            colors.green = receivedChar;
                            packetPosition = 'G';
                            break;

                        case 'G':
                            colors.blue = receivedChar;
                            packetPosition = '0';
                            packetOpened = false;
                            updateColors(colors);
                            break;
                    }
                } else {
                    if (receivedChar == 0x00) {
                        packetOpened = true;
                        packetPosition = '0';
                    }
                }
            }
        }
    }
};

void setup() {
    Serial.begin(115200);
    ledcAttachPin(RED_PIN, 1); // assign RGB led pins to channels
    ledcAttachPin(GREEN_PIN, 2);
    ledcAttachPin(BLUE_PIN, 3);

    ledcSetup(1, 12000, 8); // 12 kHz PWM, 8-bit resolution
    ledcSetup(2, 12000, 8);
    ledcSetup(3, 12000, 8);

    colors.red = 0;
    colors.green = 0;
    colors.blue = 0;

    packetOpened = false;
    packetPosition = '0';

    BLEDevice::init(DEVICE_NAME);

    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());

    BLEService *pService = pServer->createService(SERVICE_UUID);

    pTxCharacteristic = pService->createCharacteristic(
            CHARACTERISTIC_UUID_TX,
            BLECharacteristic::PROPERTY_NOTIFY
    );

    pTxCharacteristic->addDescriptor(new BLE2902());

    BLECharacteristic * pRxCharacteristic = pService->createCharacteristic(
            CHARACTERISTIC_UUID_RX,
            BLECharacteristic::PROPERTY_WRITE
    );

    pRxCharacteristic->setCallbacks(new MyCallbacks());
    pService->start();
    pServer->getAdvertising()->start();

    setColors(0, 0, 0);
    for (int i = 0; i < 5; i++) {
        delay(200);
        setColors(255, 0, 0);
        delay(200);
        setColors(0, 255, 0);
        delay(200);
        setColors(0, 0, 255);
    }

    setColors(0, 0, 0);
}

void loop() {
}
